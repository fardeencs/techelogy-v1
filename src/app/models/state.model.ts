export class StateModel {
  public static instances: StateModel;
  public title: string;
  public code: number;
  public message: string;
  public value: any;

	/**
   * init state model
   * @returns {StateModel}
   */
  public static getInstances(): StateModel {
    if (this.instances == null) {
      this.instances = new StateModel();
    }

    return this.instances;
  }

	/**
   *
   * @param code
   * @param message
   * @param value
   * @param title
   * @returns {StateModel}
   */
  public init(code, message, value: any = {}, title: string = ''): StateModel {
    this.code = code;
    this.value = value;
    this.message = message;
    this.title = title;

    return this;
  }
}
