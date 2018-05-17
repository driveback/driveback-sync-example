# Driveback Sync Experiments
Пример использования модуля Driveback Sync Experiments для UX-тестирования сайта

**Важно**: модуль Driveback Sync Experiments не работает отдельно от платформы Driveback

Основной функционал платформы Driveback добавляет:
1. Запоминание ветки, в которую попал пользователь
2. Трекинг пользователей, попавших в эксперимент
3. Трекинг конверсий

## Установка модуля

В тег <head> на всех страницах необходимо добавить следующий код как можно выше.

```
<!-- DRIVEBACK SYNC EXPERIMENTS SNIPPET -->
<style>.dbex-content-hide { opacity: 0 !important} </style>
<script type="text/javascript">
    window.DBEX_HIDE_CONTENT_STRATEGY = 'sync';
    window.DBEX_HIDE_CONTENT_TIMEOUT = 1000;
</script>
<script type="text/javascript" src="js/dbex-sync.min.js"></script>
<!-- // DRIVEBACK SYNC EXPERIMENTS SNIPPET -->
```

1. `window.DBEX_HIDE_CONTENT_STRATEGY` может принимать следующие значения
* `sync` (по умолчанию) - если вы планируете использовать UX-тестирование только в синхронном модуле Driveback Experiments
* `async` - если вы планируете использовать UX-тестирование и в других (асинхронных) кампаниях Driveback

2. `window.DBEX_HIDE_CONTENT_TIMEOUT` задает максимальную задержку в отображение видимой области страницы в случае, если по какой-то причине скрипты Driveback не загрузились
Рекомендуемые значния:
* `1000` для `window.DBEX_HIDE_CONTENT_STRATEGY = 'sync'`
* `4000` для `window.DBEX_HIDE_CONTENT_STRATEGY = 'async'`

3. Скрипт `dbex-sync.min.js` необходимо установить на свой собственный сервер для максимальной надежности, заменив при этом путь:
```
<script type="text/javascript" src="<путь_к_скрипту_на_вашем_сайте>"></script>
```
## Использование

```
dbexSync('<EXPERIMENT_ID>', [<CONTROL_WEIGHT>, <VARIATION_1_WEIGHT>, <VARIATION_2_WEIGHT>, ...], {
  1: function() {
    // Изменения для Вариации 1
  },
  2: function() {
    // Изменения для Вариации 2
  },
  ...
});
```

где,
* `EXPERIMENT_ID` - ID эксперимента, созданного в панели управления Driveback Experiments
* `CONTROL_WEIGHT` - Пропорция трафика, который идет в контрольную группу
* `VARIATION_1_WEIGHT, VARIATION_1_WEIGHT, ...` - Пропорция трафика, который идет в каждую вариацию (в сумме, которольная вес контрольной группы + весь всех вариаций = 1)

Пример:
```
dbexSync('40cde066-381f-4497-938c-e1af8de93dff', [0.2, 0.4, 0.4], {
  1: function() {
    jQuery('#main_title').text('Название сайта (Вариация 1 | 40% трафика)');
  },
  2: function() {
    jQuery('#main_title').text('Название сайта (Вариация 2 | 40% трафика)');
  }
});
```