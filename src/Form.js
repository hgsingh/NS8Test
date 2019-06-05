import React, { Component } from 'react';
import './index.css';


class Form extends React.Component {
    state = {
        canSubmit: true
    }
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setState = this.setState.bind(this)
    }

    handleSubmit() {
        console.log('the value is: ')
    }

    handleSubmitValue = (submitValue) => {
        this.setState({
            canSubmit: this.state.canSubmit && submitValue
        })
        console.log(submitValue)

    }

    render() {
        let EditPhone = editContent("input")
        let EditEmail = editContent("input")
        let EditPassword = editContent("input")
        return (<form onSubmit={this.state.canSubmit ? this.handleSubmit : undefined}>
            <div>
                <EditEmail placeholder="Email" onSaveValue={this.handleSubmitValue} validate={validateEmail} />
            </div>
            <div>
                <EditPassword placeholder="Password" type="password" autoComplete="off" onSaveValue={this.handleSubmitValue}
                    validate={validatePassword} />
            </div>
            <div>
                <EditPhone placeholder="Phone Number" onSaveValue={this.handleSubmitValue} validate={validatePhoneNumber} />
            </div>

            <button onClick={this.onSubmit}>Submit</button>
        </form>)

    }

}
function validateEmail(email) {
    console.log(email)
    let re = /\S+@\S+\.\S+/
    return re.test(String(email).toLowerCase())
}

function validatePhoneNumber(phone) {
    var re = /^[0-9]{3}[-\s][0-9]{3}[-\s][0-9]{4,6}$/
    return phone === undefined
        || String(phone) === ''
        || re.test(String(phone).toLowerCase())
}
function validatePassword(password) {
    return password !== undefined && String(password) !== ''
}

function editContent(EditComponent) {
    return class extends React.Component {
        state = {
            editing: false
        }

        toggleEdit = (e) => {
            e.stopPropagation()
            if (this.state.editing) {
                this.cancel()
            } else {
                this.edit()
            }
        }

        cancel = () => {
            console.log("CANCEL")
            this.setState(
                {
                    editing: false
                }
            )
        }


        edit = () => {
            console.log("EDIT")
            this.setState({
                editing: true
            }, () => {
                this.domElm.focus()
            })
        }
        save = () => {
            console.log("SAVE")
            this.setState({
                editing: false
            }, () => {
             
                let valid = this.props.validate(this.domElm.value)
                this.props.onSaveValue(valid)
            })
        }
        handleKeyDown = (e) => {
            const { key } = e
            switch (key) {
                case 'Enter':
                case 'Escape':
                    this.save()
                    break;
            }
        }

        render() {
            return (
                <EditComponent
                    onClick={ this.toggleEdit }
                    onKeyDown={this.handleKeyDown}
                    contentEditable={true}
                    onBlur={this.save}
                    ref={(domNode) => {
                        this.domElm = domNode;
                    }}
                    {...this.props}
                >
                    {this.props.value}
                </EditComponent>
            )
        }
    }
}

export default Form;
