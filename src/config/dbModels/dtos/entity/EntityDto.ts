export class EntityDto {
    public entityId: number;
    public entityName: string;
    public phone1: string;
    public note1: string;
    public phone2: string;
    public note2: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public addressPostcode: string; 
    public addressCity: number;
    public addressState: number; 

    constructor (params?: any) {
        const _params = params ?? {};
        this.entityId = _params?.entityId ?? -1;
        this.entityName = _params?.entityName ?? "";
        this.phone1 = _params?.phone1 ?? "";
        this.note1 = _params?.note1 ?? "";
        this.phone2 = _params?.phone2 ?? "";
        this.note2 = _params?.note2 ?? "";
        this.address1 = _params?.address1 ?? "";
        this.address2 = _params?.address2 ?? "";
        this.address3 = _params?.address3 ?? "";
        this.addressPostcode = _params?.addressPostCode ?? "";
        this.addressCity = _params?.addressCity ?? "";
        this.addressState = _params?.addressState ?? "";
    }
}