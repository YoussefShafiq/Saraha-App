import { connect } from "mongoose";
import { DB_URL } from '../../configs/app.config.js'



const testDbConncection = async () => {
    await connect(DB_URL).then(
        console.log('connected to DB successfully')
    ).catch(
        err => {
            console.log('error in connection to DB', err);
        }
    )
}

export default testDbConncection