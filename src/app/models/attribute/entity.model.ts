export class EntityModel {
  public entityName: string;
  public entityId: number;
  static toResponseModel(data: any, filters: any = []) {
    const model = new EntityModel();
    model.entityName = data.entityName;
    model.entityId = data.entityId;
    return model;
  }

}
