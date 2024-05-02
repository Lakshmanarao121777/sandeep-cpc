export class ActionObserverService{
    private count:number;
    private handlers:Map<number,any>;
    constructor(){
        this.count = 0;
        this.handlers = new Map<number,any>();
    }
    subscribe(handler:any): number{
        this.handlers.set(++this.count, handler);
        return this.count;
    }
    unsubscribe(index:number){
        this.handlers.delete(index);
    }
    fire(sender:any, args:any){
        this.handlers.forEach((func,key) =>{
            func(sender,args);
        });
    }
}