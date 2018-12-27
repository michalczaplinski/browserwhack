import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import Spinner from "../components/Spinner";
import Store from "./Store";

import Player from '../three/Player';
import Camera from '../three/Camera';
import Floor from '../three/Floor';
import Light from '../three/Light';
import { ClientApplication } from '../three/Application'

type Props = {
  serverId: string
}

class Client extends Component<Props, {}> {
  static propTypes = {
    serverId: PropTypes.string.isRequired
  };

  store = new Store({ serverId: this.props.serverId });

  componentDidMount() {
    document.onmousemove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      this.store.send({x: clientX, y: clientY, z: 0})
    }
  }

  componentWillUnmount() {
    this.store.peer.destroy();
  }

  createApplication = (element: HTMLDivElement) => {
    let camera = new Camera();
    let app = new ClientApplication(camera, element);
    let player = new Player(camera)
    let floor = new Floor();
    let light = new Light();

    app.add(player);
    app.add(floor);
    app.add(light);
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
      <div>
        <div> Connected to server with id: <span id="server-id">{serverId}</span> </div>
        <div> Own ID: <span id="client-id">{store.peer.id}</span> </div>
        
        <div 
          ref={this.createApplication} 
          style={{
            width: "80vw", 
            height: "80vh", 
            zIndex: 100
          }}
        />
      </div>
    );
  }
}

export default observer(Client);
