import {Guid} from "js-guid";

class DroppingRowsManager{
    getSingleLayoutState(builderState){
        const nextId = `col-${Guid.newGuid()}`;
        const parentId = Guid.newGuid().StringGuid;

        return {
            ...builderState,
            columns: {
                ...builderState.columns,
                [nextId]: {
                    id: nextId,
                    parentId: parentId,
                    elementIds: []
                }
            },
            columnOrder: [...builderState.columnOrder, {
                firstColId: nextId
            }]
        }
    }
    
    getDoubleLayoutState(builderState) {
        const firstColId = `col-${Guid.newGuid()}`;
        const secondColId = `col-${Guid.newGuid()}`;
        const parentId = Guid.newGuid().StringGuid;

        return {
            ...builderState,
            columns: {
                ...builderState.columns,
                [firstColId]: {
                    id: firstColId,
                    parentId: parentId,
                    elementIds: []
                },
                [secondColId]: {
                    id: secondColId,
                    parentId: parentId,
                    elementIds: []
                }
            },
            columnOrder: [
                ...builderState.columnOrder,
                {
                    firstColId: firstColId,
                    secondColId: secondColId
                }]
        }
    }
    
    getTrippleLayoutState(builderState) {
        const firstColId = `col-${Guid.newGuid()}`;
        const secondColId = `col-${Guid.newGuid()}`;
        const thirdColId = `col-${Guid.newGuid()}`;
        const parentId = Guid.newGuid().StringGuid;

        return {
            ...builderState,
            columns: {
                ...builderState.columns,
                [firstColId]: {
                    id: firstColId,
                    parentId: parentId,
                    elementIds: []
                },
                [secondColId]: {
                    id: secondColId,
                    parentId: parentId,
                    elementIds: []
                },
                [thirdColId]: {
                    id: thirdColId,
                    parentId: parentId,
                    elementIds: []
                }
            },
            columnOrder: [
                ...builderState.columnOrder,
                {
                    firstColId: firstColId,
                    secondColId: secondColId,
                    thirdColId: thirdColId
                }]
        }
    }
    
    getDoubleLeftLongLayout(builderState) {
        const firstColId = `col-${Guid.newGuid()}`;
        const secondColId = `col-${Guid.newGuid()}`;
        const parentId = Guid.newGuid().StringGuid;

        return {
            ...builderState,
            columns: {
                ...builderState.columns,
                [firstColId]: {
                    id: firstColId,
                    parentId: parentId,
                    lengthType: 'long',
                    elementIds: []
                },
                [secondColId]: {
                    id: secondColId,
                    parentId: parentId,
                    elementIds: []
                }
            },
            columnOrder: [
                ...builderState.columnOrder,
                {
                    firstColId: firstColId,
                    secondColId: secondColId
                }]
        }
    }
    
    getDoubleRightLongLayout(builderState){
        const firstColId = `col-${Guid.newGuid()}`;
        const secondColId = `col-${Guid.newGuid()}`;
        const parentId = Guid.newGuid().StringGuid;

        return {
            ...builderState,
            columns: {
                ...builderState.columns,
                [firstColId]: {
                    id: firstColId,
                    parentId: parentId,
                    elementIds: []
                },
                [secondColId]: {
                    id: secondColId,
                    parentId: parentId,
                    lengthType: 'long',
                    elementIds: []
                }
            },
            columnOrder: [
                ...builderState.columnOrder,
                {
                    firstColId: firstColId,
                    secondColId: secondColId
                }]
        }
    }
    
    drop(ev, builderState){
        const targetId = ev.dataTransfer.getData('id');

        if (targetId === 'singleLayout') {
            return this.getSingleLayoutState(builderState)
        }

        if (targetId === 'doubleLayout') {
            return this.getDoubleLayoutState(builderState)
        }

        if (targetId === 'tripleLayout') {
            return this.getTrippleLayoutState(builderState)
        }

        if (targetId === 'doubleLeftLongLayout') {
            return this.getDoubleLeftLongLayout(builderState)
        }

        if (targetId === 'doubleRightLongLayout') {
            return this.getDoubleRightLongLayout(builderState)
        }
    }
}

export default DroppingRowsManager;