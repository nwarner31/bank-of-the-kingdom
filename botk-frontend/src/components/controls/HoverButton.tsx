import { useState } from 'react';

interface hbprops {
    mainColor: string,
    secondColor: string,
    text: string,
    className?: string;
}

function HoverButton(props: hbprops) {
    const [hover, setHover] = useState(false);

    const {mainColor, secondColor, text} = props;

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false)
    }

    return <span className={props.className ?? ""} style={{backgroundColor: hover ? secondColor : mainColor, color: hover ? mainColor: secondColor}} onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>{text}

    </span>
}

export default HoverButton;