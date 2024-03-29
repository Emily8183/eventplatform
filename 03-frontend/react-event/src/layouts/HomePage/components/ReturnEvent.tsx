import { useState, useEffect } from "react";
import EventModel from "../../../models/EventModel";
import React from "react";
import { Link } from "react-router-dom";
// this is for dynamic page

export const ReturnEvent: React.FC<{ event: EventModel }> = (props) => {
  return (
    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div className="text-center">
        {/* if else statement to display either the image called from the API or a default image */}
        {props.event.img ? (
          <img src={props.event.img} width="151" height="233" alt="event" />
        ) : (
          <img
            src={require("../../.././Images/EventsImages/event1.jpg")}
            width="151"
            height="233"
            alt="event"
          />
        )}
        <h6 className="mt-2">{props.event.title}</h6>
        <p>{props.event.speaker}</p>
        <Link
          className="btn main-color text-white"
          to={`checkout/${props.event.id}`}
        >
          Reserve
        </Link>
      </div>
    </div>
  );
};
