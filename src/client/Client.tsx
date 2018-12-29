import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import Spinner from "../components/Spinner";
import Store from "../stores/ClientStore";

import Application from '../three/Application';
import { BFElement } from "../types";

type Props = {
  serverId: string
}

class Client extends Component<Props, {}> {
  static propTypes = {
    serverId: PropTypes.string.isRequired
  };

  store = new Store({ serverId: this.props.serverId });

  componentWillUnmount() {
    this.store.peer.destroy();
  }

  createApplication = (element: HTMLDivElement & BFElement) => {
    let app = new Application(element, this.store);
  }

  render() {
    const { serverId } = this.props;
    const { store } = this;

    if (store.loading) {
      return <Spinner />;
    }

    if (store.error) {
      return (
        <div>
          Could not connect to server {serverId}
          <Link to="/">
            <button>Back to home</button>
          </Link>
        </div>
      );
    }

    return (   
        <div 
          ref={this.createApplication} 
          style={{
            width: "100vw", 
            height: "100vh", 
            zIndex: 100
          }}
        >
          <div> Connected to server with id: <span id="server-id">{serverId}</span> </div>
          <div> Own ID: <span id="client-id">{store.peer.id}</span> </div>
      </div>
    );
  }
}

export default observer(Client);
