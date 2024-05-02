#!/bin/bash
echo "inside build service.sh"
source concourse-repo/scripts/get_env_variable_and_properties.sh
set -e -u -x

cd git-branch/.git
short_ref=`sed -n '1p' short_ref`

cd ..

cf_domain=
cf_host=
cf_org=
cf_space=
manifest=

if [ $environment = "development" ] || [ $environment = "integration" ]
	then
		cf_domain=$cf_domain_nonprod
		cf_org=$cf_org_nonprod
		if [ $environment = "development" ]
			then
				cf_host=$cf_host_dev
				cf_space=$cf_space_dev
				manifest="manifest-dev.yml"
		elif [ $environment = "integration" ]
			then
				cf_host=$cf_host_int
				cf_space=$cf_space_int
				manifest="manifest-int.yml"
		fi
fi

java --version
./gradlew clean build
cd build/libs
file_name=`ls | grep -v plain`
cd ../..

cf8 login -a https://api.$cf_domain -u $cf_user -p $cf_password -o $cf_org -s $cf_space
cf8 apps

base_application_name="Method_of_Payment_Service_V2"
new_application_name="$base_application_name-$short_ref"

if [ $(cf8 apps | grep $cf_host.$cf_domain/$cf_path | cut -f1 -d " " | awk '{$1=$1;print}') ]
	then
		current_application_name=`cf8 apps | grep $cf_host.$cf_domain/$cf_path | cut -f1 -d " " | awk '{$1=$1;print}'`
		if [ $current_application_name = $new_application_name ]
			then
				cf8 push $new_application_name -m 1g -p build/libs/$file_name -f $manifest -t 180 -b java_buildpack --no-start
				cf8 set-env "$new_application_name" SPRING_CLOUD_CONFIG_USERNAME "$config_server_user"
				cf8 set-env "$new_application_name" SPRING_CLOUD_CONFIG_PASSWORD "$config_server_password"
				cf8 restage $new_application_name
		else
			cf8 push $new_application_name -m 1g -p build/libs/$file_name -f $manifest -t 180 -b java_buildpack --no-start --no-route
			cf8 set-env "$new_application_name" SPRING_CLOUD_CONFIG_USERNAME "$config_server_user"
			cf8 set-env "$new_application_name" SPRING_CLOUD_CONFIG_PASSWORD "$config_server_password"
			cf8 map-route $new_application_name $cf_domain --hostname $cf_host --path $cf_path
			if [ $environment != "development" ]
      	then
      		cf8 bind-service "$new_application_name" appdynamics-service
      	  cf8 unbind-service "$current_application_name" appdynamics-service
    	fi
			cf8 restage $new_application_name
			cf8 unmap-route $current_application_name $cf_domain --hostname $cf_host --path $cf_path
			if [ $(cf8 apps | grep $base_application_name | grep stopped | cut -f1 -d " " | awk '{$1=$1;print}') ]
      	then
      		old_application_name=`cf8 apps | grep $base_application_name | grep stopped | cut -f1 -d " " | awk '{$1=$1;print}'`
      		cf8 delete $old_application_name -r -f
      fi
			cf8 stop $current_application_name
	  fi
else
	cf8 push $new_application_name -m 1g -p build/libs/$file_name -f $manifest -t 180 -b java_buildpack --no-start --no-route
	cf8 set-env "$new_application_name" SPRING_CLOUD_CONFIG_USERNAME "$config_server_user"
	cf8 set-env "$new_application_name" SPRING_CLOUD_CONFIG_PASSWORD "$config_server_password"
	cf8 map-route $new_application_name $cf_domain --hostname $cf_host --path $cf_path
	if [ $environment != "development" ]
  	then
  		cf8 bind-service "$new_application_name" appdynamics-service
  fi
	cf8 restage $new_application_name
fi

cf8 apps