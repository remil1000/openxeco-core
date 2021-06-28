import React from "react";
import "./PageMedia.css";
import { NotificationManager as nm } from "react-notifications";
import Loading from "./box/Loading.jsx";
import Message from "./box/Message.jsx";
import Image from "./item/Image.jsx";
import { getRequest } from "../utils/request.jsx";
import DialogAddImage from "./dialog/DialogAddImage.jsx";
import CheckBox from "./button/CheckBox.jsx";
import { dictToURI } from "../utils/url.jsx";

export default class PageMedia extends React.Component {
	constructor(props) {
		super(props);

		this.refresh = this.refresh.bind(this);

		this.state = {
			images: null,
			page: 1,
			order: "desc",
			showLogoOnly: false,
			showLoadMoreButton: true,
		};
	}

	componentDidMount() {
		this.refresh();
	}

	componentDidUpdate(_, prevState) {
		if (prevState.showLogoOnly !== this.state.showLogoOnly
			|| prevState.order !== this.state.order) {
			this.refresh();
		}
	}

	refresh() {
		this.setState({
			images: null,
			page: 1,
		}, () => {
			this.fetchImages();
		});
	}

	fetchImages() {
		const params = {
			logo_only: this.state.showLogoOnly,
			order: this.state.order,
			page: this.state.page,
		};

		getRequest.call(this, "media/get_images?" + dictToURI(params), (data) => {
			this.setState({
				images: (this.state.images === null ? [] : this.state.images).concat(data.items),
				page: this.state.page + 1,
				showLoadMoreButton: data.pagination.page < data.pagination.pages,
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	changeState(field, value) {
		this.setState({ [field]: value });
	}

	render() {
		return (
			<div id="PageMedia" className="page max-sized-page">
				<div className={"row"}>
					<div className="col-md-12">
						<h1>Media</h1>
						<div className="top-right-buttons">
							<button
								onClick={() => this.refresh()}>
								<i className="fas fa-redo-alt"/>
							</button>
							<DialogAddImage
								trigger={
									<button
										className={"blue-background"}
										data-hover="Filter">
										<span><i className="fas fa-plus"/></span>
									</button>
								}
								afterValidate={this.refresh}
							/>
						</div>
					</div>
				</div>

				<div className={"row row-spaced"}>
					<div className="col-md-12">
						<div className="PageMedia-buttons">
							<CheckBox
								label={"SHOW LOGO ONLY"}
								value={this.state.showLogoOnly}
								onClick={() => this.changeState("showLogoOnly", !this.state.showLogoOnly)}
							/>
							<CheckBox
								label={this.state.order === "asc" ? "OLDEST FIRST" : "NEWEST FIRST"}
								value={this.state.order !== "asc"}
								onClick={() => this.changeState(
									"order",
									this.state.order === "asc" ? "desc" : "asc",
								)}
							/>
						</div>
					</div>
				</div>

				<div className={"row row-spaced"}>
					<div className="col-md-12">
						{this.state.images === null
							&& <Loading
								height={300}
							/>
						}

						{this.state.images !== null && this.state.images.length === 0
							&& <Message
								text={"No media in the library"}
								height={300}
							/>
						}

						{this.state.images !== null && this.state.images.length !== 0
							&& <div className="row">
								{this.state.images.map((i) => i).map((i) => (
									<div
										key={i.id}
										className="col-md-2 col-sm-3">
										<Image
											id={i.id}
											thumbnail={i.thumbnail}
											height={i.height}
											width={i.width}
											creationDate={i.creation_date}
										/>
									</div>
								))}
							</div>
						}
					</div>
				</div>

				<div className={"row row-spaced"}>
					<div className="col-md-12 centered-buttons">
						{this.state.showLoadMoreButton
							? <button
								className={"blue-background"}
								onClick={() => this.fetchImages()}>
								<i className="fas fa-plus"/> Load more images
							</button>
							: <button
								className={"blue-background"}
								disabled={true}>
								No more image to load
							</button>
						}
					</div>
				</div>
			</div>
		);
	}
}
