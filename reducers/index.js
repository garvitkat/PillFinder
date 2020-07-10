

const initialState = { data: {
    lasttime: 'Loading..',
    income: 'Loading..',
    efficiency: 'Loading..',
    daypower: 'Loading..',
    monthpower: 'Loading..',
    yearpower: 'Loading..' }
  }; 


  const reducer = (state = initialState, action) => {
    
        switch (action.type) {
            case 'SET_STATS':
            let returnobj =  {...state,
            data: {
            ...state.data,
            lasttime: action.payload.data[0].lasttime,
            income: action.payload.data[0].income,
            efficiency: action.payload.data[0].efficiency,
            daypower: action.payload.data[0].daypower,
            monthpower: action.payload.data[0].monthpower,
            yearpower: action.payload.data[0].yearpower,                    
        }
            };
            console.log('REDUCER ACTION: ', returnobj);
                return returnobj;
            case 'CLEAR_STATS':
                    return ({ ...state,
                        lasttime: 0,
                        income: 0,
                        efficiency: 0,
                        daypower: 0,
                        monthpower: 0,
                        yearpower: 0,         
                        });
                    default:
                        return state;
                    
        }
  };

export default reducer;
