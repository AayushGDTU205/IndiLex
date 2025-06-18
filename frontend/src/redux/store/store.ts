import { legacy_createStore as createStore } from "redux";
import rootReducer from "../reducers/rootReducer";

const store = createStore(rootReducer);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;