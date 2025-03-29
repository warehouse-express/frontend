import { useState, useEffect, useCallback } from "react";
import { ApiError } from "@/types/api";

//basic interface for the state of the api request, including data, loading state, and error
interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

//custom hooks

//hook for fetching data, takes a fetch function and an array of dependencies as arguments
export function useFetch<T>(
    //function to fetch data and return a promise(api call)
  fetchFn: () => Promise<any>,
  //array of values that will if changed will cause the fetch function to be called again
  dependencies: any[] = []
) {
    //creates a state variable with initial value of data: null, isLoading: true, and error: null
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  //side effect that will run on mount and on every dependency change
  useEffect(() => {
    //helps keep track of whether the component is still mounted
    let isMounted = true;

    //asyn function that will fetch data and update the state
    const fetchData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        //tries to call the fetch function and update the state with the data
        const response = await fetchFn();
        if (isMounted) {
          setState({
            data: response.data,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            error: error as ApiError,
          });
        }
      }
    };

    //call the fetch data function to initiate the api request
    fetchData();

    //returning a cleanup function that sets isMounted to false
    return () => {
      isMounted = false;
    };
    //if any of the dependencies change, the fetch function will be called again
  }, dependencies);

  //returns the current state object with the data, loading state, and error
  return state;
}

//hook for mutation operations (create, update, delete)
//T and P are passed to the hook when it is called
//T is the type of the data returned by the mutation function
//P is the type of the data passed to the mutation function
//example: useMutation<Product, ProductDto>(productService.createProduct)
//takes a mutation function that changes data
export function useMutation<T, P>(mutationFn: (params: P) => Promise<any>) {
  //create state to track the entire mutation process
  //combines the standard API state (data, loading, error) with isSuccess flag
  const [state, setState] = useState<ApiState<T> & { isSuccess: boolean }>({
    data: null, 
    isLoading: false, 
    error: null, 
    isSuccess: false, 
  });

  //create a stable callback function that won't change between renders
  //this is the function components will call to trigger the mutation
  const mutate = useCallback(
    //the function accepts parameters of type P (ex. product data)
    async (params: P) => {
      //update state to show we're loading and reset success status
      setState((prev) => ({ ...prev, isLoading: true, isSuccess: false }));
      
      try {
        //call the provided mutation function (ex. createProduct) with the parameters
        const response = await mutationFn(params);
        //when successful, update state with the response data and success indicators
        setState({
          data: response.data, //store the returned data (e.g., created product)
          isLoading: false, 
          error: null, 
          isSuccess: true, 
        });
        //return the data so callers can use it directly
        return response.data;
      } catch (error) {
        //if something goes wrong, update state with error information
        setState({
          data: null, 
          isLoading: false, 
          error: error as ApiError, 
          isSuccess: false, 
        });
        //re-throw the error so caller can catch and handle it if needed
        throw error;
      }
    },
    //only recreate this function if mutationFn changes
    [mutationFn]
  );

  // Return both the mutate function and all state properties
  // This allows components to call mutate() and check isLoading, error, etc.
  return { mutate, ...state };
}