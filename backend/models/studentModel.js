

function getNewStudentModel(){
    return {
        id:"",
        firstName:"",
        lastName:"",
        birthDate:new Date(),
        hobbies:"",
        photoUrl:"",
        dateCreated:new Date()
    }
}


exports.checkStudentModel=(model)=>{
    let errorMessage="";
    let isError=false;
    if(!model.firstName || model.firstName.replace(/\s/g, '').length<=0)
    {
        [isError,errorMessage]= appendError(isError,errorMessage,"Please fill the first name field");
    }
    if(!model.lastName || model.firstName.replace(/\s/g, '').length<=0)
    {
        [isError,errorMessage]=appendError(isError,errorMessage,"Please fill the last name field");
    }
    if(!model.birthDate)
    {
        [isError,errorMessage]=appendError(isError,errorMessage,"Please select a Birth date");
    }
    return {isError,errorMessage};
}

function appendError(isError,error,message)
{
    isError=true;
    if(error.length>0)
    {
        error+="\n"+message;
    }
    else{
        error+=message;
    }
    return [isError,error];
}