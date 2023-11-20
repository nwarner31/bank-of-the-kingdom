import {Theme} from "./models";

const themes: {[id: string]: Theme} = {
    "Toad": {
        mainColor: "rgb(232, 15, 39)",
        mainTextColor: "white",
        secondaryColor: "#FCD1A7",
        secondaryTextColor: "black",
        headImg: "toad-head.jpg"
},
    "Mario": {
        mainColor: "rgb(230, 45, 54)",
        mainTextColor: "black",
        secondaryColor: "#0165b3",
        secondaryTextColor: "white",
        headImg: "mario-head.jpg"
},
    "Peach": {
        mainColor: "#ff608f",
        mainTextColor: "#fee600",
        secondaryColor: "#ffa3d0",
        secondaryTextColor: "white",
        headImg: "peach-head.jpg"
},
    "Luigi": {
        mainColor: "rgb(31, 167, 71)",
        mainTextColor: "black",
        secondaryColor: "#0165b3",
        secondaryTextColor: "white",
        headImg: "luigi-head.jpg"
},
    "Yoshi": {
        mainColor: "#52D942",
        mainTextColor: "white",
        secondaryColor: "#EB6122",
        secondaryTextColor: "white",
        headImg: "yoshi-head.jpg"
}
}

export default themes;