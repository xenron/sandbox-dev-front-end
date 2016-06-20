
import React from 'react';
import Mask from '../mask/mask';
import Button from '../button/button';
import style from './modal.less';

export default class Modal extends React.Component {
    render() {

        const {isOpen, title, actions, onRequestClose, children} = this.props;

        return (
            <div style={{display: isOpen ? 'block' : 'none'}}>
                <Mask onClick={onRequestClose} />
                <div className={style.modal}>
                    <div className={style.hd}>
                        <h2 className={style['hd-title']}>{title}</h2>
                    </div>
                    <div className={style.bd}>
                        {children}
                    </div>
                    <div className={style.ft}>
                        {
                            actions.map((action, idx) => {
                                const {label, type, onClick} = action;
                                return (
                                    <Button key={idx} onClick={onClick} type={type}>{label}</Button>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}