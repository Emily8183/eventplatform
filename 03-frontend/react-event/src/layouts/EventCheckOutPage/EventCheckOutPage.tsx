import { useEffect, useState } from "react";
import EventModel from "../../models/EventModel";
import { StarsReview } from "../Utils/StarsReview";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { LatestReviews } from "./LatestReviews";

export const EventCheckoutPage = () => {
  const [event, setEvent] = useState<EventModel>();
  const [isLoading, setIsLoading] = useState(true);

  const [httpError, setHttpError] = useState(null);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const eventId = window.location.pathname.split("/")[2];
  // localhost:3000/checkout/eventId

  useEffect(() => {
    //fetch data from api
    const fetchEvent = async () => {
      const baseUrl: string = `http://localhost:8080/api/events/${eventId}`;
      // NOTE: must use backtick ` instead of ""
      const response = await fetch(baseUrl);

      //if else statement to see if needs to throw an error
      if (!response.ok) {
        throw new Error("Somthing went wrong!");
      }

      //save data to responseData
      const responseJson = await response.json();

      // set up a new variable, then run a loop to push the data from the api(responseData) to the variable
      const loadedEvent: EventModel = {
        id: responseJson.id,
        title: responseJson.title,
        speaker: responseJson.speaker,
        description: responseJson.description,
        tickets: responseJson.tickets,
        ticketsAvailable: responseJson.ticketsAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setEvent(loadedEvent);
      setIsLoading(false);
    };

    fetchEvent().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  useEffect(() => {
    const fetchEventReviews = async () => {
      const reviewUrl: string = `http://localhost:8080/api/reviews/findByBookId?bookId=${eventId}`;

      const responseReviews = await fetch(reviewUrl);

      if (!responseReviews.ok) {
        throw new Error("Somthing went wrong!");
      }

      const responseJsonReviews = await responseReviews.json();

      const responseData = responseJsonReviews._embedded.review;
      // the extracted array of review objects is stored in the responseData variable

      const loadedReviews: ReviewModel[] = [];
      //set up loadedReviews of type ReviewModel array equals to an empty array

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          event_id: responseData[key].eventId,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews += responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);

        setTotalStars(Number(round));
        //Number() function is a built-in function that converts a string to a number
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchEventReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading || isLoadingReview) {
    return <SpinnerLoading />;
  }

  return (
    <div className="container d-none d-lg-block">
      <div className="row mt-5">
        <div className="col-sm-2 col-md-2">
          {event?.img ? (
            <img src={event?.img} width="226" height="349" alt="Event" />
          ) : (
            <img
              src={require("../.././Images/EventsImages/event1.jpg")}
              width="226"
              height="349"
              alt="Event"
            />
          )}
        </div>
        <div className="col-4 col-md-4 container">
          <div className="ml-2">
            <h2>{event?.title}</h2>
            <h5 className="text-primary">{event?.speaker}</h5>
            <p className="lead">{event?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
      </div>
      <LatestReviews reviews={reviews} eventId={event?.id} mobile={false} />
    </div>

    //TODO: add mobile display here
  );
};
