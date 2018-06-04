class Store {
    constructor() {
        this.setStateCallbackMap = {};

        this.getStateCallBackMap = {};
    }

    setStateOf(componentName, state) {
        this.setStateCallbackMap[componentName](state);
    }

    getStateOf(componentName) {
        return this.getStateCallBackMap[componentName]();
    }

    register(componentName, componentSetState, componentState) {
        this.setStateCallbackMap[componentName] = componentSetState;
        this.getStateCallBackMap[componentName] = componentState;
    }
}

export default Store;
