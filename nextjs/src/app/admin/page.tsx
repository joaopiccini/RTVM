"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../hooks/useMap";
import useSwr from "swr";
import { fetcher } from "../utils/http";
import { Route } from "../utils/model";
import { socket } from "../utils/socket-io";

export function AdminPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    socket.connect();

    socket.on('new-point', (data: {route_id: string, lat: number, lng: number}) => {
        if (!map?.hasRoute(data.route_id)) {

        }
    })
    return () => {
      socket.disconnect();
    }
  }, []);

  async function startRoute() {
    const routeId = (document.getElementById("route") as HTMLSelectElement).value;
    const response = await fetch(`http://localhost:3000/routes/${routeId}`);
    const route: Route = await response.json();

    map?.removeAllRoutes();

    await map?.addRouteWithIcons({
      routeId: routeId,
      startMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: route.directions.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
    });

    const {steps} = route.directions.routes[0].legs[0];

    for(const step of steps){
      await sleep(2000);
      map?.moveCar(routeId, step.start_location);
      socket.emit('new-point', {
        route_id: routeId,
        lat: step.start_location.lat,
        lng: step.start_location.lng
      });

      await sleep(2000);
      map?.moveCar(routeId, step.end_location);
      socket.emit('new-point', {
        route_id: routeId,
        lat: step.end_location.lat,
        lng: step.end_location.lng
      });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100%", width: "100%" }}>
      <div id="map" style={{ height: "100%", width: "100%" }} ref={mapContainerRef}></div>
    </div>
  );
}

export default AdminPage;
