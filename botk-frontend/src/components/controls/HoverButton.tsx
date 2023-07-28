import { useState } from 'react';
import '../../Theming.css';

interface hbprops {
    text: string,
    baseClass: string,
    hoverClass: string,
    className?: string,
    clickAction?: () => void
}

function HoverButton(props: hbprops) {
    const [hover, setHover] = useState(false);

    const { text} = props;

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false)
    }

    return <span className={(props.className + " " ?? "") + (hover ? props.hoverClass : props.baseClass)}  onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave} onClick={props.clickAction}>{text}

    </span>
}

export default HoverButton;