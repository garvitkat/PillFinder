import axios from 'axios';
import reducer from '../reducers/index';

export const get_stats = () => (dispatch) => {
    axios.get('http://www.solarmanpv.com/portal/Terminal/TerminalMain.aspx?pid=74069');
    axios.get('http://www.solarmanpv.com/portal/AjaxService.ashx?ac=upTerminalMain&psid=74069')
    .then(response => {
        console.log(response.data); 

        dispatch({
            type: 'SET_STATS',
            payload: { data: response.data }
        });
        console.log('DONE, dispatched');
    })
    .catch((e) => {
      console.error(e);
    }); 
};

