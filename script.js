"use strict"

document.addEventListener('DOMContentLoaded', function () { // Стандартная проверка на то, что документ загружен

   const form = document.getElementById('form') // Перехват отправки формы по нажатию кнопки
   form.addEventListener('submit', formSend)

   async function formSend(element) {
      element.preventDefault(); // form
      //Делаем простую валидацию форм

      let error = formValidate(form); //

      let formData = new FormData(form); // эта строка получает с помощью ФормДата вытягивает все данные форм полей
      formData.append('image', formImage.files[0]) // Здесь мы добавлем еще и изображение, полученное из формы

      if (error === 0) {
         form.classList.add('_sending')// по этому классу будем сообщать пользователю, что идет отправка формы на почту
         let response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData
         });

         if (response.ok) {
            let result = await response.json()
            alert(result.message)
            formPreview.innerHTML = '';
            form.reset()
            form.classList.remove('_sending')
         } else {
            alert('Ошибка')
            form.classList.remove('_sending')
         }
      } else {
         alert('Заполните обязательные поля')

      }
   }


   function formValidate(form) {
      let error = 0

      let formReq = document.querySelectorAll('._req') // класс присваивается тем элементам, которые обязательны для заполнения

      for (let index = 0; index < formReq.length; index++) {
         const input = formReq[index];

         // каждый раз, когда мы будем приступать к проверке, нам нужно убрать класс _error
         formRemoveError(input)

         if (input.classList.contains('_email')) {
            if (emailTest(input)) {
               formAddError(input)
               error++;
            }
            //Проверка на тип и если у него состояния checked
         } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
            formAddError(input)
            error++;
         } else {
            if (input.value === '') {
               formAddError(input);
               error++;
            }
         }
      }
       return error
   }


   function formAddError(input) {
      input.parentElement.classList.add('_error');
      input.classList.add('_error')
   }

   function formRemoveError(input) {
      input.parentElement.classList.remove('_error');
      input.classList.remove('_error')
   }
   // Для проверки эмейл необходима еще одна функция
   function emailTest(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)
   }




   // Получаем инпут file в переменную
   const formImage = document.getElementById('formImage')
   // Получаем вид для превью в переменную
   const formPreview = document.getElementById('formPreview')

   //Слушаем изменения в инпуте file
   formImage.addEventListener('change', () => {

      uploadFile(formImage.files[0])

   });


   function uploadFile(file) {
      // Проверяем тип файла
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
         alert('Разрешены только изображения.')
         formImage.value = '';
         return;
      }
      //Проверим размер файла (< 2мб)
      if (file.size > 2 * 1024 * 1024) {
         alert('Файл должен быть менее 2 мб')
         return
      }



      var reader = new FileReader();

      reader.onload = function (e) {
         formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`
      }
      // Если будет ошибка, то
      reader.onerror = function (e) {
         alert('Ошибка')
      }
      //Продолжаем работу
      reader.readAsDataURL(file)
   }
})
