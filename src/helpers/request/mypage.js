import axios from 'axios';
import { encryptIt } from '../encrypt';
import storage from '../localForage.helper';

const FUNFUR = process.env.REACT_APP_URL;

export const requestCheckPassword = (password) => {
    console.log(password);
    
    let passwordOutPut = encryptIt(password);
    return storage.get('token').then((token) => {
        return passwordOutPut.then((value) => {
            console.log(value);
            return axios({
                method: 'POST',
                    url: `${FUNFUR}/mypage_web/confirm_me`,
                    headers: {
                        Authorization: token
                    },
                    data: {
                        password: value
                    }
            }).then(res => {
                console.log(res);
                return res;
            }).catch(err => {
                if(err) throw err;
            });
        });
    });
}

export const requestGetMyInfo = () => {
    return storage.get('token').then((token) => {
        return axios({
            method: 'GET',
            url: `${FUNFUR}/mypage_web/profile`,
            headers: {
                Authorization: token
            }
        }).then(res => {
            return res;
        }).catch(err => {
            if(err) throw err;
        });
    });
}