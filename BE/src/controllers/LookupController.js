
module.exports = {
    index: async(req,res,next)=>{
        try{
            const lookups = {
                bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
            };
            res.status(200).json(lookups);
        }catch(error){
            console.error(error);
            next(error);
        }
    },
};