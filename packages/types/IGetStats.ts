export interface IGetStats {
  modules: IModule[];
}

interface IModule {
  id: string;
  name: string;
  reasons: IReason[];
}

interface IReason {
  moduleName: string;
  moduleId: string;
}
