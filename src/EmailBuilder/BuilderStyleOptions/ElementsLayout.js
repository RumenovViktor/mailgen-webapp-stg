import React from "react";
import TitleElement from "../Elements/TitleElement";
import TextElement from "../Elements/TextElement";
import SocialElement from "../Elements/SocialElement";
import ImageElement from "../Elements/ImageElement";
import DividerElement from "../Elements/DividerElement";

const ElementsLayout = () => {

    const drag = (ev) => {
        ev.dataTransfer.setData("id", ev.target.id);
        ev.dataTransfer.setData("type", "element")
    }
    
    return <>
        <div style={{float: 'left', width: '30%', height: '800px', background: '#ECEFF1', marginTop: '10px'}}>
            <TitleElement
                id={"titleElement"}
                onDragStart={event => drag(event)} />
            <TextElement
                id={"textElement"}
                onDragStart={event => drag(event)} />
            <SocialElement
                id={"socialElement"}
                onDragStart={event => drag(event)} />
            <ImageElement
                id={"imageElement"}
                onDragStart={event => drag(event)} />
            <DividerElement
                id={"dividerElement"}
                onDragStart={event => drag(event)} />
        </div>
    </>
}

export default ElementsLayout