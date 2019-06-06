import React, { Component } from 'react';
import './index.css';


class Form extends React.Component {
    
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setState = this.setState.bind(this)
        this.state = {
            canSubmit: false,
            email:'',
            password:'',
            number:''
        }
    }

    handleSubmit() {
        console.log('the value is: ')
    }

    handleEmailValue = (submitValue) => {
        this.setState({
            email: submitValue
        })
    }
    handlePasswordValue = (submitValue) => {
        this.setState({
            password: submitValue
        })
    }
    handlePhoneValue = (submitValue) => {
        this.setState({
            number: submitValue
        })
    }

    render() {
        let EditPhone = editContent("input", validatePhoneNumber)
        let EditEmail = editContent("input", validateEmail)
        let EditPassword = editContent("input",validatePassword)
        return (<form onSubmit={this.state.canSubmit ? this.handleSubmit : undefined}>
            <div>
                <EditEmail placeholder="Email" 
                 onSaveValue={this.handleEmailValue}  />
            </div>
            <div>
                <EditPassword placeholder="Password" 
                type="password" 
                autoComplete="off" onSaveValue={this.handlePasswordValue}/>
            </div>
            <div>
                <EditPhone placeholder="Phone Number" 
                onSaveValue={this.handlePhoneValue}  />
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

function editContent(EditComponent, validate) {
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
                let valid = validate(this.domElm.value)
                if(valid){
                    this.props.onSaveValue(this.domElm.value)
                }
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
