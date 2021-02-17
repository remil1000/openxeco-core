import React, { Component } from 'react';
import './Company.css';
import Popup from "reactjs-popup";
import {NotificationManager as nm} from 'react-notifications';
import {getRequest, postRequest} from '../../utils/request';
import FormLine from '../button/FormLine';
import Loading from '../box/Loading';
import DialogConfirmation from '../dialog/DialogConfirmation';
import Tab from '../tab/Tab';
import CompanyGlobal from './company/CompanyGlobal';
import CompanyAddress from './company/CompanyAddress';
import CompanyTaxonomy from './company/CompanyTaxonomy';
import CompanyWorkforce from './company/CompanyWorkforce';


export default class Company extends Component {

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.confirmCompanyDeletion = this.confirmCompanyDeletion.bind(this);

        this.state = {
            isDetailOpened: false,
        }
    }

    onClick() {
        if (typeof this.props.disabled !== "undefined" || !this.props.disabled) {
            this.onOpen();

            let newState = !this.props.selected;
            if (typeof this.props.onClick !== "undefined")
                this.props.onClick(this.props.id, newState);
        }
    };

    onClose() {
        this.setState({ isDetailOpened: false }, () => {
            if (this.props.onClose !== undefined)
                this.props.onClose()
        });
    }

    onOpen() {
        this.setState({ isDetailOpened: true }, () => {
            if (this.props.onOpen !== undefined)
                this.props.onOpen()
        });
    }

    confirmCompanyDeletion() {
        let params = {
            id: this.props.id,
        }

        postRequest.call(this, "company/delete_company", params, response => {
            document.elementFromPoint(100, 0).click()
            nm.info("The company has been deleted");

            if (typeof this.props.afterDeletion !== "undefined")
                this.props.afterDeletion();
        }, response => {
            nm.warning(response.statusText);
        }, error => {
            nm.error(error.message);
        });
    }

    render() {
        return (
            <Popup
                className="Popup-full-size"
                trigger={
                    <div className={"Company"}>
                        <i className="fas fa-building"/>
                        <div className={"Company-name"}>
                            {this.props.name}
                        </div>
                    </div>
                }
                modal
                closeOnDocumentClick
                onClose={this.onClose}
                onOpen={this.onOpen}
                open={this.props.open || this.state.isDetailOpened}
            >
                <div className="row row-spaced">

                    <div className="col-md-12">
                        <div className={"top-right-buttons"}>
                            <button
                                className={"blue-background"}
                                onClick={() => window.open('http://google.com/search?q=' + this.props.name)}>
                                <i className="fab fa-google"></i>
                            </button>
                            <DialogConfirmation
                                text={"Are you sure you want to delete this company?"}
                                trigger={
                                    <button
                                        className={"red-background"}>
                                        <i className="fas fa-trash-alt"/>
                                    </button>
                                }
                                afterConfirmation={() => this.confirmCompanyDeletion()}
                            />
                        </div>
                        <h1 className="Company-title">
                            {this.props.name}
                        </h1>

                        <Tab
                            menu={["Global", "Address", "Taxonomy", "Workforce"]}
                            content={[
                                <CompanyGlobal
                                    id={this.props.id}
                                />,
                                <CompanyAddress
                                    id={this.props.id}
                                    name={this.props.name}
                                />,
                                <CompanyTaxonomy
                                    id={this.props.id}
                                />,
                                <CompanyWorkforce
                                    id={this.props.id}
                                />
                            ]}
                        />
                    </div>
                </div>
            </Popup>
        );
    }
}