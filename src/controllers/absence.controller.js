import { Op } from 'sequelize';
import { Absence } from '../models/absence.js';
import { Employee } from '../models/employee.js';
import { Schedule } from '../models/schedule.model.js';

export const getAbsence = async (req, res) => {
    try {
        const absences = await Absence.findAll({
            include: [
                { model: Employee },
                { model: Schedule }
            ]
        });
        return res.status(200).json(absences);
    } catch (error) {
        console.error('Error al obtener las faltas', error.message);
        return res.status(500).json({ error: 'Error al encontrar las faltas' });
    }
};

export const findAbsenceByName = async (req, res) => {
    const name = req.params.name;

    try {

        const nameToSearch = await Employee.findOne({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });
        
        if (!nameToSearch) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        const absence = await Absence.findAll({
            where: {
                employeeID: nameToSearch.employeeID
            }
        });
        return res.status(200).json(absence);
    } catch (error) {
        console.error('Error al encontrar las faltas por nombre', error.message);
        return res.status(500).json({ error: 'Error al encontrar las faltas por nombre' });
    }
};

export const findAbsenceByEmployeeID = async (req, res) => {
	const { employeeID } = req.params;

	try {
		const employee = await Employee.findOne({
			where: {
				employeeID,
			},
		});

		if (!employee) {
			return res.status(404).json({ error: 'Employee not found' });
		}

		const absences = await Absence.findAll({
			where: {
				employeeID: employee.employeeID,
			},
			include: [
				{
					model: Employee,
					attributes: ['name', 'lastName'], 
				},
			],
		});

		if (!absences || absences.length === 0) {
			return res
				.status(404)
				.json({ error: 'No faults found for this employee' });
		}

		return res.status(200).json(absences);
	} catch (error) {
		console.error('Error in obtaining faults per enrollment:', error.message);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

export const getAbsenceJustified = async (req, res) => {
    try {
        const absences = await Absence.findAll({
            where: {
                Justified: 0 
            }
        });

        return res.status(200).json(absences);
    } catch (error) {
        console.error('No se encontraron las faltas no justificadas', error.message);
        return res.status(500).json({ error: 'Error al encontrar las faltas no justificadas' });
    }
};

export const createAbsence = async (req, res) => {
    const absenceBody = req.body;

    try {
        await Absence.create(absenceBody);

        return res.status(201).json({ success: true, message: 'Falta creada con éxito' });
    } catch (error) {
        console.error('Error al ingresar los datos de la falta:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor al crear la falta' });
    }
};


export const updateAbsence = async (req, res) => {
    const { absenceID, name, employeeID, scheduleID, absenceDate, justified } = req.body;

    try {
        const absenceToUpdate = await Absence.findByPk(absenceID);

        if (!absenceToUpdate) {
            return res.status(404).json({ error: 'Falta no encontrada' });
        }

        await absenceToUpdate.update({
            name,
            employeeID,
            scheduleID,
            absenceDate,
            justified
        });

        return res.status(200).json({ success: true, message: 'La Falta se actualizó correctamente' });
    } catch (error) {
        console.error('Error al actualizar la Falta', error.message);
        return res.status(500).json({ error: 'Error al realizar actualizacion' });
    }
};

export const deleteAbsence = async (req, res) => {
    const { absenceID } = req.body;

    try {
        const absenceToUpdate = await Absence.findByPk(absenceID);

        if (!absenceToUpdate) {
            return res.status(404).json({ error: 'Falta no encontrada' });
        }

        if (absenceToUpdate.justified === 0) {
            await absenceToUpdate.update({ justified: 1 });
            return res.status(200).json({ success: true, message: 'El estado de la falta se cambió a ya no justificada' });
        } else {
            return res.status(400).json({ error: 'La falta ya estaba justificada' });
        }
    } catch (error) {
        console.error('Error al actualizar la Falta', error.message);
        return res.status(500).json({ error: 'Error al realizar actualización' });
    }
};

export const deleteAbsenceByTrue = async (req, res) => {
    const { absenceID } = req.body;

    try {
        const absenceToDelete = await Absence.findByPk(absenceID);

        if (!absenceToDelete) {
            return res.status(404).json({ error: 'Falta no encontrada' });
        }

        await absenceToDelete.destroy(); // Eliminar la falta de la base de datos

        return res.status(200).json({ success: true, message: 'Falta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la Falta', error.message);
        return res.status(500).json({ error: 'Error al realizar la eliminación' });
    }
};



export const methods = {
    getAbsence,
    findAbsenceByName,
    createAbsence,
    updateAbsence,
    deleteAbsence,
    getAbsenceJustified,
    deleteAbsenceByTrue,
    findAbsenceByEmployeeID
};
