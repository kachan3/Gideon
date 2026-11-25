const paths={
 Cortante:'M5 19 19 5M13 5h6v6M4 14l6 6',Punzante:'m12 3 4 10-4-2-4 2 4-10ZM12 11v10',Contundente:'m5 4 9 0 0 6-9 0ZM10 10v11',
 Fuego:'M12 3c3 5-2 5 2 8l3-4c6 9 0 14-5 14S2 16 7 9c0 5 4 2 5-6Z',Frío:'M12 2v20M3 7l18 10M3 17 21 7M8 4l4 3 4-3M8 20l4-3 4 3',Rayo:'m14 2-9 12h6l-1 8 9-12h-6l1-8Z',
 shield:'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z',sword:'m5 19 14-14v6L9 21M3 15l6 6M4 20l-2 2',hand:'M7 12V5a2 2 0 0 1 4 0v5-6a2 2 0 0 1 4 0v7-4a2 2 0 0 1 4 0v8c0 5-4 7-7 7s-5-4-7-6a2 2 0 0 1 2-3Z',
 heart:'M20 5c-3-3-6 0-8 2-2-2-5-5-8-2-5 5 4 12 8 16 4-4 13-11 8-16Z',star:'m12 2 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7Z'
};
export function icon(name){return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]??paths.shield}"/></svg>`;}
