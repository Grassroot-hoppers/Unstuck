/**
 * Unstuck — shared Supabase helpers for persistent results (v0.2).
 * Depends on global `supabase` from @supabase/supabase-js UMD build.
 */
(function (global) {
  'use strict';

  var LAST_KEY = 'unstuck_last_result_id';
  var ID_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
  var ID_LEN = 6;
  var SAVE_MAX_ATTEMPTS = 12;

  var SUPABASE_URL = 'https://kxgftilyoghdjzknehts.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Z2Z0aWx5b2doZGp6a25laHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzYyMDEsImV4cCI6MjA5MDA1MjIwMX0.MU2TLshVlVb3O2LFy_FtxIYdBW30jUy8AHP2AhUNOQE';

  function getSupabaseClient(lib) {
    if (!lib || SUPABASE_URL === 'https://placeholder.supabase.co') return null;
    try {
      return lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      return null;
    }
  }

  function generateShortId() {
    var id = '';
    for (var i = 0; i < ID_LEN; i++) {
      id += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length));
    }
    return id;
  }

  function setLastResultId(id) {
    try {
      global.localStorage.setItem(LAST_KEY, id);
    } catch (e) {}
  }

  function getLastResultId() {
    try {
      return global.localStorage.getItem(LAST_KEY);
    } catch (e) {
      return null;
    }
  }

  function clearLastResultId() {
    try {
      global.localStorage.removeItem(LAST_KEY);
    } catch (e) {}
  }

  function isUniqueViolation(err) {
    if (!err) return false;
    if (err.code === '23505') return true;
    var msg = (err.message || '').toLowerCase();
    return msg.indexOf('duplicate') !== -1 || msg.indexOf('unique') !== -1;
  }

  async function saveResultsRow(sb, payload) {
    if (!sb) return null;
    var scoresObj = payload.scoresObj;
    var age_group = payload.age_group;
    var gender = payload.gender;

    for (var attempt = 0; attempt < SAVE_MAX_ATTEMPTS; attempt++) {
      var id = generateShortId();
      var res = await sb.from('results').insert({
        id: id,
        scores: scoresObj,
        age_group: age_group,
        gender: gender,
      });
      var error = res.error;
      if (!error) return id;
      if (isUniqueViolation(error)) continue;
      console.warn('Supabase save failed:', error.message || error);
      return null;
    }
    console.warn('Supabase save: exhausted id retries');
    return null;
  }

  global.UnstuckSupabase = {
    getSupabaseClient: getSupabaseClient,
    generateShortId: generateShortId,
    saveResultsRow: saveResultsRow,
    setLastResultId: setLastResultId,
    getLastResultId: getLastResultId,
    clearLastResultId: clearLastResultId,
    LAST_RESULT_STORAGE_KEY: LAST_KEY,
  };
})(typeof window !== 'undefined' ? window : this);
