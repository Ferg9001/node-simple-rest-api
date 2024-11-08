import { pool } from '../db.ts'
import { UsersSchema } from '../../types/users.types.ts'

export const getUsers = async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM users')
    res.json(rows)
}

export const getUser = async(req, res) => {
    const {id} = req.params
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    if(rows.length === 0) {
        res.status(404).json({message:'user not found'})
        return
    }

    res.json(rows[0])
}

export const createUser = async(req, res) => {
    try {
        const {name, email} =  req.body

        const validateFields = UsersSchema.safeParse({
            name,
            email
        })

        if(!validateFields.success) {
            res.status(400).json({
                message: 'not valid data',
                error: validateFields.error
            })
        }

        const {rows} = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        )
        res.json(rows[0])        
    } catch (error) {
        if(error?.code === '23505'){
            res.status(409).json({message: 'email already exists'})
            return  
        }
        res.status(500).json({message: 'internal server error'})
    }
}

export const deleteUser = async(req, res) => {
    const {id} = req.params
    const {rowCount} = await pool.query('DELETE FROM users WHERE id = $1', [id])
    
    if(rowCount === 0) {
        res.status(404).json({message:'user not found'})
        return
    }
    res.json({message: 'user deleted'})
}

export const updateUser = async(req, res) => {
    const {id} = req.params
    const {name, email} = req.body
    const {rows} = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *'
        , [name, email, id]
    )
    res.json(rows[0])
}