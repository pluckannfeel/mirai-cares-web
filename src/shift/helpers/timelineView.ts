export const timelineShiftType = (type: string | undefined) => {
    if(!type){
        return "primary"
    }

    if( type.includes("重訪")){
        return "success"
    }else if(type.includes("研修")){
        return "warning"
    }else {
        return "primary"
    }
}