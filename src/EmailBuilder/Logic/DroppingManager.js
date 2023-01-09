import DroppingRowsManager from "./DroppingRowsManager";
import DroppingElementsManager from "./DroppingElementsManager";

class DroppingManager{    
    constructor() {
        this._droppingRowsManager = new DroppingRowsManager();
        this._droppingElementsManager = new DroppingElementsManager();
    }

    drop (ev) {
        ev.preventDefault();
        const typeData = ev.dataTransfer.getData('type')

        if (typeData === 'rows') this._droppingRowsManager.drop(ev)
        if (typeData === 'element') this._droppingElementsManager.drop(ev)
    }
}

export default DroppingManager;