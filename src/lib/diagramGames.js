// src/lib/diagramGames.js
import { supabase } from './supabase'

export const diagramGames = {
  async uploadImage(institutionId, file) {
    const path = `diagram-games/${institutionId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('user-content').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('user-content').getPublicUrl(path)
    return data.publicUrl
  },

  async create(creatorId, { subject, title, mode, imageUrl, hotspots, examTags = [], difficulty = 2 }) {
    try {
      const { data, error } = await supabase.from('diagram_games').insert({
        subject, title, mode, image_url: imageUrl, hotspots, exam_tags: examTags,
        difficulty, created_by: creatorId,
      }).select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('create diagram game error:', err)
      return null
    }
  },

  async listBySubject(subject) {
    try {
      const { data, error } = await supabase.from('diagram_games').select('*').eq('subject', subject).order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('listBySubject error:', err)
      return []
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase.from('diagram_games').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('getAll error:', err)
      return []
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase.from('diagram_games').select('*').eq('id', id).single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('getById error:', err)
      return null
    }
  },
}
