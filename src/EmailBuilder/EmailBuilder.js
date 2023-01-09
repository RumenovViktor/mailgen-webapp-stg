import React, {useEffect, useState} from 'react'
import MailgenElement from "./Elements/MailgenElement";
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";
import BuilderStyleFactory from "./BuilderStyleOptions/BuilderStyleFactory";
import builderData from './builderData'
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import TitleHtmlElement from "./HtmlElements/TitleHtmlElement";
import HtmlSingleLayout from "./HtmlLayouts/HtmlSingleLayout";
import styled from 'styled-components';
import {Guid} from "js-guid";
import HtmlDoubleLayout from "./HtmlLayouts/HtmlDoubleLayout";
import HtmlTripleLayout from "./HtmlLayouts/HtmlTripleLayout";
import DroppingManager from "./Logic/DroppingManager";

const Wrapper = styled.div`
    width: 100%; 
    margin-top: 2%;
    text-align: initial;
`;

const BuilderStyleButtonsWrapper = styled.div`
    text-align: center;
    width: 30%;
`;

const DropArea = styled.div`
    width: 65%;
    margin: 0 auto;
    background-color: white;
`;

const DropAreaWrapper = styled.div`
    float: right;
    width: 65%;
    height: 800px;
    margin-right: 4%;
    margin-top: 0.6%;
    background-color: #ECEFF1;
`;

const Container = styled.div`
    
`;

const EmailBuilder = () => {
    let _droppingManager;
    const [selectedStyleOption, setSelectedStyleOption] = React.useState('elements');
    const [builderState, setBuilderState] = useState(builderData)

    const handleStyleOptionChange = (event) => {
        setSelectedStyleOption(event.target.value);
    };

    const groupBy = (xs, key) => {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const allowDrop = (ev) => {
        ev.preventDefault();
    }

    const dropRows = (ev) => {
        const targetId = ev.dataTransfer.getData('id');

        if (targetId === 'singleLayout') {
            const nextId = `col-${Guid.newGuid()}`;
            const parentId = Guid.newGuid().StringGuid;

            setBuilderState({
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
            })
        }

        if (targetId === 'doubleLayout') {
            const firstColId = `col-${Guid.newGuid()}`;
            const secondColId = `col-${Guid.newGuid()}`;
            const parentId = Guid.newGuid().StringGuid;

            setBuilderState({
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
            })
        }

        if (targetId === 'tripleLayout') {
            const firstColId = `col-${Guid.newGuid()}`;
            const secondColId = `col-${Guid.newGuid()}`;
            const thirdColId = `col-${Guid.newGuid()}`;
            const parentId = Guid.newGuid().StringGuid;

            setBuilderState({
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
            })
        }

        if (targetId === 'doubleLeftLongLayout') {
            const firstColId = `col-${Guid.newGuid()}`;
            const secondColId = `col-${Guid.newGuid()}`;
            const parentId = Guid.newGuid().StringGuid;

            setBuilderState({
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
            })
        }

        if (targetId === 'doubleRightLongLayout') {
            const firstColId = `col-${Guid.newGuid()}`;
            const secondColId = `col-${Guid.newGuid()}`;
            const parentId = Guid.newGuid().StringGuid;

            setBuilderState({
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
            })
        }
    }

    const dropElement = (ev) => {
        let id = ev.target.attributes['data-rbd-draggable-id'];

        if (!id){
            id = ev.target.attributes['data-rbd-droppable-id'];
        }

        if (!id) return;

        const targetElementId = id.value;
        const column = builderState.columns[targetElementId];

        if (!column) return;

        const newId = Guid.newGuid().StringGuid;
        const newElement = <TitleHtmlElement id={newId}/>;

        setBuilderState({
            ...builderState,
            elements: {
                ...builderState.elements,
                [newId]: {
                    id: newId,
                    content: newElement
                }
            },
            columns: {
                ...builderState.columns,
                [targetElementId]: {
                    ...column,
                    elementIds: [
                        ...column.elementIds,
                        newId
                    ]
                }
            }
        })
    }

    const drop = (ev) => {
        ev.preventDefault();
        const typeData = ev.dataTransfer.getData('type')

        if (typeData === 'rows') dropRows(ev)
        if (typeData === 'element') dropElement(ev)
    }

    const onDragEnd = (result) => {
        const {destination, source, draggableId, type} = result;
        
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'row') {
            const newColumnOrder = Array.from(builderState.columnOrder);

            const copyOfMoved = newColumnOrder[source.index];
            newColumnOrder.splice(source.index, 1)
            newColumnOrder.splice(destination.index, 0, copyOfMoved)

            const newState = {
                ...builderState,
                columnOrder: newColumnOrder
            }

            setBuilderState(newState)
            return;
        }

        const start = builderState.columns[source.droppableId];
        const finish = builderState.columns[destination.droppableId];

        if (start === finish) {
            const newElementIds = Array.from(start.elementIds);

            newElementIds.splice(source.index, 1);
            newElementIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                elementIds: newElementIds
            };

            const newBuilderState = {
                ...builderState,
                columns: {
                    ...builderState.columns,
                    [newColumn.id]: newColumn
                }
            }

            setBuilderState({...newBuilderState})
            return;
        }

        const startElementIds = Array.from(start.elementIds);
        startElementIds.splice(source.index, 1);
        const newStartColumn = {
            ...start,
            elementIds: startElementIds
        }

        const finishElementIds = Array.from(finish.elementIds);
        finishElementIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
            ...finish,
            elementIds: finishElementIds
        }

        const newBuilderState = {
            ...builderState,
            columns: {
                ...builderState.columns,
                [newStartColumn.id]: newStartColumn,
                [newFinishColumn.id]: newFinishColumn
            }
        }

        setBuilderState({...newBuilderState})
    }

    const renderSingleLayout = (column, index) => {
        return <>
            <HtmlSingleLayout
                key={Guid.newGuid().StringGuid}
                id={column.id}
                index={index}
                column={builderState.columns[column.id]}
                elements={builderState.elements}/>
        </>
    }

    const renderDoubleLayout = (firstColumn, secondColumn, index) => {
        return <>
            <HtmlDoubleLayout
                key={Guid.newGuid().StringGuid}
                index={index}
                firstColumn={builderState.columns[firstColumn.id]}
                secondColumn={builderState.columns[secondColumn.id]}
                elements={builderState.elements}/>
        </>
    }

    const renderTripleLayout = (firstColumn, secondColumn, thirdColumn, index) => {
        return <>
            <HtmlTripleLayout
                key={Guid.newGuid().StringGuid}
                index={index}
                firstColumn={builderState.columns[firstColumn.id]}
                secondColumn={builderState.columns[secondColumn.id]}
                thirdColumn={builderState.columns[thirdColumn.id]}
                elements={builderState.elements}/>
        </>
    }

    const renderLayouts = () => {
        const columnsArray = builderState.columnOrder.map(x => {
            let list = [];
            if (x.firstColId) {
                list.push(builderState.columns[x.firstColId]);
            }

            if (x.secondColId) {
                list.push(builderState.columns[x.secondColId]);
            }

            if (x.thirdColId) {
                list.push(builderState.columns[x.thirdColId]);
            }
            return list;
        });

        const grouped = groupBy(columnsArray.flat(), 'parentId');

        return Object.keys(grouped).map((parentId, index) => {
            const columns = grouped[parentId];
            
            if (columns.length === 1) {
                return renderSingleLayout(columns[0], index);
            }
            if (columns.length === 2) {
                return renderDoubleLayout(columns[0], columns[1], index);
            }
            if (columns.length === 3) {
                return renderTripleLayout(columns[0], columns[1], columns[2], index);
            }
        })
    }
    
    useEffect(() => {
        _droppingManager = new DroppingManager()
    }, [])

    return <>
        <Wrapper>
            <BuilderStyleButtonsWrapper>
                <ToggleButtonGroup
                    color="primary"
                    value={selectedStyleOption}
                    onChange={(event, newAlignment) => {
                        handleStyleOptionChange(event, newAlignment)
                    }}>
                    <ToggleButton style={{textTransform: "none"}} value="elements">Elements</ToggleButton>
                    <ToggleButton style={{textTransform: "none"}} value="layout">Layout</ToggleButton>
                </ToggleButtonGroup>
            </BuilderStyleButtonsWrapper>
            <BuilderStyleFactory selectedOption={selectedStyleOption}/>
            <DropAreaWrapper>
                <DropArea
                    onDrop={ev => drop(ev)}
                    onDragOver={event => allowDrop(event)}>
                    <DragDropContext
                        onDragStart={() => {
                        }}
                        onDragEnd={onDragEnd}>
                        <Droppable droppableId="all-columns" direction="vertical" type="row">
                            {provided => {
                                return <>
                                    <Container {...provided.droppableProps} ref={provided.innerRef}>
                                        {renderLayouts(provided)}
                                        {provided.placeholder}
                                    </Container>
                                </>;
                            }}
                        </Droppable>
                    </DragDropContext>
                    <MailgenElement />
                </DropArea>
            </DropAreaWrapper>
        </Wrapper>
        <div style={{clear: "both"}}></div>
    </>
}

export default EmailBuilder