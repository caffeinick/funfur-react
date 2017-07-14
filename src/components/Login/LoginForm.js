import React, { Component } from 'react';
import LocalForage from 'localforage';
import { Link } from 'react-router-dom';
import { Spinner } from 'components/Common';
import storage from 'helpers/localForage.helper';

var ReactToastr = require('react-toastr');
var { ToastContainer } = ReactToastr; // This is a React Element.
// For Non ES6...
// var ToastContainer = ReactToastr.ToastContainer;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.addAlert = this.addAlert.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToastOff = this.handleToastOff.bind(this);
    }

    componentDidMount() {
        LocalForage.setItem('hi', 'worldsss');
    }

    /* toast 창띄우기 */
    addAlert(types, msg) {  /* enum of types: ['warning', 'success', 'error', 'info'],  msg: String */
        switch(types) {
            case 'warning':
                return this.toastRef.warning(`${msg}`);
            case 'success':
                return this.toastRef.success(`${msg}`);
            case 'error':
                return this.toastRef.error(`${msg}`);
            default:
                break;
        }
    }

    /* input 값에 따라 redux에 form store 값 업데이트 */
    changeHandler(ev) {
        const { FormActions } = this.props;
        
        FormActions.formChange({
            formName: 'login',
            name: ev.target.name,
            value: ev.target.value
        });
    }

    handleSubmit = async (ev) => {
        const { AuthActions, form } = this.props;
        ev.preventDefault();

        let userId = form.get('userId');
        let pw = form.get('password');
        if(userId === '' || typeof userId !== 'string') {
            this.addAlert('warning', '아이디를 입력해주세요!');
            this.idInput.focus();
        } else if(pw === '' || typeof pw !== 'string') {
            this.addAlert('warning', '비밀번호를 입력해주세요!');
            this.pwInput.focus();
        } else {
            try {
                await AuthActions.loginCeo(userId, pw);
                console.log(this.props.valid.login);
                console.log(this.props.status.token);
                if(this.props.valid.login) {
                    storage.set('token', this.props.status.token);
                    this.props.router.history.push('/');
                }
            } catch (e) {
                console.log(e);
                if(e) {
                    this.addAlert('error', '아이디나 패스워드를 확인해주세요!');
                }
            }
        }
    }

    // 토스트 창 껐을 때 인풋 포커스
    handleToastOff() {
        const { form } = this.props;
        let userId = form.get('userId');
        let pw = form.get('password');

        var a = LocalForage.getItem('hi');
        console.log(a);
        if(userId === '' || typeof userId !== 'string') {
            this.idInput.focus();
        } else if(pw === '' || typeof pw !== 'string') {
            this.pwInput.focus();
        } else {
            this.idInput.focus();
        }
    }

    render() {
        const {
            changeHandler,
            handleSubmit,
            handleToastOff
        } = this;

        return (
            <div className="login-form">
                {/* 스피너 */}
                { this.props.status.login.get('fetching') && (<Spinner />) }
                {/* 토스트 컨테이너 */}
                <ToastContainer
                    ref={(toast) => { this.toastRef = toast }}
                    toastMessageFactory={ToastMessageFactory}
                    className={ document.documentElement.clientWidth < 768 ? 'toast-bottom-center' : 'toast-top-right' }
                    onClick={handleToastOff}
                />
                <h1 className="funfur-color">뻔뻐</h1>
                <h3>뻔뻐에 오신걸 환영합니다.</h3>
                <div className="form-group">
                    <input
                        ref={(input) => { this.idInput = input }}
                        type="text"
                        className="form-control login-input"
                        name="userId"
                        placeholder="아이디"
                        required
                        onChange={changeHandler}
                    />
                </div>
                <div className="form-group">
                    <input
                        ref={(input) => { this.pwInput = input }}
                        type="password"
                        className="form-control login-input"
                        name="password"
                        placeholder="비밀번호"
                        required
                        onChange={changeHandler}
                    />
                </div>
                <button
                    type="button"
                    className="btn funfur-btn width100"
                    onClick={handleSubmit}>로그인
                </button>
                <div className="find-wrapper">
                    <Link to="/findAuth">아이디/패스워드 찾기</Link>
                    <p>뻔뻐에 아직 입주 안했나요?</p>
                </div>
                <Link
                    to="/register"
                    className="btn btn-prev btn-common width100"
                    style={{ margin: 0 }}>회원가입
                </Link>
            </div>
        );
    }
}

export default LoginForm;