export default function TimePicker() {
  return (
    <div className="mt-2 w-40 rounded-lg bg-white p-5 shadow-xl">
      <div className="flex">
        <select
          name="hours"
          className="appearance-none bg-transparent text-xl outline-none"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">10</option>
          <option value="12">12</option>
        </select>
        <span className="mr-3 text-xl">:</span>
        <select
          name="minutes"
          className="mr-4 appearance-none bg-transparent text-xl outline-none"
        >
          <option value="0">00</option>
          <option value="30">30</option>
        </select>
        <select
          name="ampm"
          className="appearance-none bg-transparent text-xl outline-none"
        >
          <option value="am">AM</option>
          <option value="pm">PM</option>
        </select>
      </div>
    </div>
  )
}
