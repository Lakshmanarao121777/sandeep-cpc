// import { IViewModel } from '../model/view.model';
export class LabelService{
    // public viewModel: IViewModel = Object.assign({});
    private labelTextMap:Map<string,string> = Object.assign({});
    
    changeLabel(labelText:Map<string,string>){
        this.labelTextMap = labelText;
        //change label if customerClass is business
        let inputField = '';
        for(const [key, value] of this.labelTextMap.entries()) {            
            inputField = key.replace('-label', '');
            this.getElementRef(`[name="${key}"]`).innerHTML = value;
            this.getElementRef(`[name="${inputField}"]`)?.setAttribute('aria-label', value);
        }
    }   
    getElementRef = (selector: string): any => {
        // return this.viewModel.template.ccContent.querySelector(selector);
        return document.querySelector(selector);
    };
}
