import { createStore } from "redux";
import reduce from "./reducers";

let store = createStore(reduce);
export default store;
