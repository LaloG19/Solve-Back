import { Schedule } from '../models/schedule.model.js';

// Este GET obtendra todos los schedules

const getSchedule = async (req, res) => {
	try {
		const data = await Schedule.findAll();
		return res.status(200).json(data);
	} catch (error) {
		console.error('Error in obtaining schedule data', error.message);
		return res.status(500).json({ error: 'Error in obtaining data' });
	}
};

// Este GET buscara un schedule mediante un id

const findOneSchedule = async (req, res) => {
	const ScheduleID = req.params.id;
	try {
		const data = await Schedule.findOne({
			where: {
				ScheduleID,
			},
		});
		if (!data) {
			return res.status(404).json({ message: 'Schedule not found' });
		}
		return res.status(200).json(data);
	} catch (error) {
		console.error('Error in obtaining user schedule', error.message);
		return res.status(500).json({ error: 'Error in obtaining user schedule' });
	}
};

// POST que se encargara de crear un schedule

const createSchedule = async (req, res) => {
	const scheduleBody = req.body;
	try {
		await Schedule.create(scheduleBody);
		return res.status(200).json({ success: true, message: 'New Schedule' });
	} catch (error) {
		console.error('Error to create Schedule', error);
		return res.status(500).json({ error: 'Error to create Schedule' });
	}
};

// Este PATCH se encargara de actualizar todo un schedule

const updateSchedule = async (req, res) => {
	const {
		scheduleID,
		entryTime,
		exitTime,
		monday,
		tuesday,
		wednesday,
		thursday,
		friday,
		saturday,
		sunday,
	} = req.body;

	console.log('Updating schedule with ID:', scheduleID);

	try {
		const [updatedRows] = await Schedule.update(
			{
				entryTime,
				exitTime,
				monday,
				tuesday,
				wednesday,
				thursday,
				friday,
				saturday,
				sunday,
			},
			{ where: { scheduleID } },
		);

		if (updatedRows === 0) {
			console.log('Schedule not found with ID:', scheduleID);
			return res.status(404).json({ error: 'Schedule not found' });
		}

		console.log('Schedule updated successfully');
		return res.status(200).json({ success: true, message: 'Schedule updated' });
	} catch (error) {
		console.error('Error updating schedule:', error);
		return res.status(500).json({ error: 'Error to update schedule' });
	}
};

// Este es un PATCH que se encargara de actualizar seleccionando el ID

const updateOneSchedule = async (req, res) => {
	const scheduleID = req.params.id;
	const {
		entryTime,
		exitTime,
		monday,
		tuesday,
		wednesday,
		thursday,
		friday,
		saturday,
		sunday,
	} = req.body;

	console.log('Updating schedule with ID:', scheduleID);

	try {
		const [updatedRows] = await Schedule.update(
			{
				entryTime,
				exitTime,
				monday,
				tuesday,
				wednesday,
				thursday,
				friday,
				saturday,
				sunday,
			},
			{ where: { scheduleID } },
		);

		if (updatedRows === 0) {
			console.log('Schedule not found with ID:', scheduleID);
			return res.status(404).json({ error: 'Schedule not found' });
		}

		console.log('Schedule updated successfully');
		return res.status(200).json({ success: true, message: 'Schedule updated' });
	} catch (error) {
		console.error('Error updating schedule:', error);
		return res.status(500).json({ error: 'Error to update schedule' });
	}
};

// Este DELETE borrara todo el schedule mediante un id

const deleteSchedule = async (req, res) => {
	const scheduleID = req.body.scheduleID;
	console.log('Deleting schedule with ID:', scheduleID);

	try {
		const rowsDeleted = await Schedule.destroy({ where: { scheduleID } });
		if (rowsDeleted === 0) {
			console.log('Schedule not found with ID:', scheduleID);
			return res.status(404).json({ error: 'Schedule not found' });
		}
		console.log('Schedule deleted successfully');
		return res.status(200).json({ success: true, message: 'Deleted Schedule' });
	} catch (error) {
		console.error('Error deleting schedule:', error);
		return res.status(500).json({ error: 'Error to delete schedule' });
	}
};

export const scheduleController = {
	createSchedule,
	getSchedule,
	updateSchedule,
	deleteSchedule,
	findOneSchedule,
	updateOneSchedule,
};
