export const check=async(req,res)=>{
    try {
        console.log(req.user);
        return res.status(200).json({message:"Session active"});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}