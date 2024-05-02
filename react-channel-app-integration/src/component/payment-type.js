import React from 'react';

const PaymentType = ({cpcPageType}) =>{
    let [ccSelected, setCcSelected ] = React.useState(true);
    let [achSelected, setAchSelected ] = React.useState(false);
    
    function handleChange(inputPaymentType) {
        if(inputPaymentType === 'CardOnly') {
            setCcSelected(true);
            setAchSelected(false);
        } else if(inputPaymentType === 'AchOnly') {
            setCcSelected(false);
            setAchSelected(true);
        }
        cpcPageType(inputPaymentType);
    }

    return (
        <nav>
        <div>
            <input type="radio" name="pageType" value='CardOnly' checked={ccSelected} onChange={() => {handleChange('CardOnly');}}/>Crdit Card
            <input type="radio" name="pageType" value='AchOnly' checked={achSelected} onChange={()=>{handleChange('AchOnly');}}/>ACH            
        </div>
        </nav>
    );
}
export default PaymentType;
