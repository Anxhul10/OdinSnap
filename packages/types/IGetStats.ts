export interface IGetStats {
  modules: IModule[];
}

export interface IModule {
  id: string;
  name: string;
  reasons: IReason[];
}

export interface IReason {
  moduleName: string;
  moduleId: string;
}
