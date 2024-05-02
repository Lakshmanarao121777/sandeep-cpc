#!/bin/bash
echo "inside rollback service.sh"
set -e -u -x

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
		elif [ $environment = "integration" ]
			then
				cf_host=$cf_host_int
				cf_space=$cf_space_int
		fi
fi

cf8 login -a https://api.$cf_domain -u $cf_user -p $cf_password -o $cf_org -s $cf_space
cf8 apps

current_application_name=`cf8 apps | grep $cf_host.$cf_domain/$cf_path | cut -f1 -d " " | awk '{$1=$1;print}'`
rollback_application_name=`cf8 apps | grep $base_application_name | grep stopped | cut -f1 -d " " | awk '{$1=$1;print}'`

cf map-route $rollback_application_name $cf_domain --hostname $cf_host --path $cf_path
if [ $environment != "development" ]
	then
		cf bind-service "$rollback_application_name" appdynamics-service
		cf unbind-service "$current_application_name" appdynamics-service
fi
cf restage $rollback_application_name
cf unmap-route $current_application_name $cf_domain --hostname $cf_host --path $cf_path
cf stop $current_application_name
cf apps