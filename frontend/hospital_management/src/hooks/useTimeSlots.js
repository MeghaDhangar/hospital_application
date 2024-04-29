import moment from 'moment';

const useTimeSlots = () => {
  const createTimeSlots = (perPatientTime, times) => {
    let hashmap = {};

    times.forEach((time , index) => {
      const { start_time, slots: availableSlots, total_slots } = time;
      const startTime = moment(start_time, 'HH:mm:ss');
      const perSlotTime = moment.duration(perPatientTime);
      let currentSlotTime = startTime.clone();


      let skipSlot = total_slots - availableSlots;

      // Simulate booked slots, replace this with your actual booked slots logic
      for (let i = 0; i < skipSlot; i++) {
        currentSlotTime.add(perSlotTime);
      }

      let nextAvailableSlots = [];
      let remainingSlots = availableSlots;

      for (let i = 0; i < remainingSlots; i++) {
        let slot = currentSlotTime.format('HH:mm:ss');
        nextAvailableSlots.push(slot);
        currentSlotTime.add(perSlotTime);
      }

      // hashmap[start_time] = [...bookedSlots, ...nextAvailableSlots];
      hashmap[index+1] = [ ...nextAvailableSlots];
    });

    return hashmap;
  };

  return { createTimeSlots };
};

export default useTimeSlots;
