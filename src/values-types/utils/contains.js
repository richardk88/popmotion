export default (term) => (v) => ((typeof v === 'string') && v.indexOf(term) !== -1);
