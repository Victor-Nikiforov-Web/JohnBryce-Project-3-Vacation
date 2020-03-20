export class VacationModel {
    public constructor(public vacationID?:number ,public description?:string ,
        public destination?:string ,public image?:string ,public fromDate?:string | Date ,
        public toDate?:string | Date ,public price?:number ,public follow?:boolean){}
}