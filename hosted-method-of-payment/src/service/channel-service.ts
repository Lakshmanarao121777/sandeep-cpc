import { IChannelData } from '../model/channel-data';

export class ChannelService{
    public channelData:IChannelData;
    constructor(channelData:IChannelData){
        this.channelData = channelData;
    }
}