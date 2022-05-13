import "./styles.scss";

export default function ScheduleCards({ data }) {

  return (
    <div className="cards-container">
      <div className="card">
        <div className="card-title">
          <p>Hoje</p>
          <p className="text-blue">
            {data.currentDay?.finished}/{data.currentDay?.total}
          </p>
        </div>
        <div className="card-content">
          <div className="card-icon blue">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="card-text">
            {data.currentDay?.total > 0
              ? "Já foram realizadas " +
                data.currentDay?.finished +
                " das " +
                data.currentDay?.total +
                " coletas agendadas!"
              : "Não há agendamentos!"}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">
          <p>Esta semana</p>
          <p className="text-yellow">
            {data.currentWeek?.finished}/{data.currentWeek?.total}
          </p>
        </div>
        <div className="card-content">
          <div className="card-icon yellow">
            <i className="fa-solid fa-calendar-week"></i>
          </div>
          <div className="card-text">
            {data.currentWeek?.total > 0
              ? "Já foram realizadas " +
                data.currentWeek.finished +
                " das " +
                data.currentWeek.total +
                " coletas agendadas!"
              : "Não há agendamentos!"}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">
          <p>Este mês</p>
          <p className="text-green">
            {data.currentMonth?.finished}/{data.currentMonth?.total}
          </p>
        </div>
        <div className="card-content">
          <div className="card-icon green">
            <i className="fa-solid fa-calendar-days"></i>
          </div>
          <div className="card-text">
            {data.currentMonth?.total > 0
              ? "Já foram realizadas " +
                data.currentMonth?.finished +
                " das " +
                data.currentMonth?.total +
                " coletas agendadas!"
              : "Não há agendamentos!"}
          </div>
        </div>
      </div>
    </div>
  );
}