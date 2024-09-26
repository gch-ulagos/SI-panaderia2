import { RestartAlt } from "@mui/icons-material";
import axios from "axios";

const getProducts = async (token) => {
    try {
        const resp = await axios.get('http://localhost:3001/api/v1/products/getAllProducts', {
            headers: {
                token
            }
        });
        return resp.data;
    } catch (e) {
        console.error(e)
    }
}

export default {
    getProducts
};